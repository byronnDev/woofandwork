import json
import logging
import os
import re
import shutil
import subprocess  # Añadido para ejecutar comandos
import sys
import tkinter as tk
import webbrowser
from dataclasses import dataclass
from datetime import datetime
from tkinter import filedialog, messagebox, scrolledtext, ttk
from typing import Dict, List, Optional

from markitdown import MarkItDown
from PIL import Image  # Añadimos la importación de Pillow

# Configuración
CONFIG = {
    'POSTS_DIR': "src/content/posts",
    'IMAGES_DIR': "public/images/blog",
    'WINDOW_SIZE': "900x800",  # Ventana más grande
    'ICON_PATH': 'icono.ico',
    'LOG_FILE': 'upload_log.log',
    'ALLOWED_EXTENSIONS': ['.jpg', '.jpeg', '.png', '.webp'],
    'REPO_DIR': os.path.dirname(os.path.dirname(os.path.abspath(__file__))),  # Directorio del repositorio
    'DEPLOY_COMMANDS': [
        ['git', 'add', '.'],
        ['git', 'commit', '-m', 'Nuevo post añadido'],
        ['git', 'push', 'origin', 'main'],
        ['npm', 'run', 'build'],
        ['npm', 'run', 'deploy']
    ],
    'COLORS': {
        'background': '#1e1e1e',
        'surface': '#2d2d2d',
        'input_bg': '#3d3d3d',        # Color más oscuro para inputs
        'input_fg': '#e0e0e0',        # Texto más suave para inputs
        'primary': '#bb86fc',
        'secondary': '#03dac6',
        'text': '#ffffff',
        'text_secondary': '#b3b3b3',
        'error': '#cf6679',
        'success': '#03dac6',
        'warning': '#ffb74d',
        'selection_bg': '#404040',    # Color de selección
        'hover': '#4d4d4d',           # Color para hover
        'button_disabled': '#666666',  # Nuevo color para botones deshabilitados
        'label_bg': '#2d2d2d'         # Color específico para fondos de labels
    },
    'FONTS': {
        'main': ('Segoe UI', 10),
        'code': ('Cascadia Code', 10),
        'title': ('Segoe UI', 12, 'bold')
    },
    'HELP_URL': 'https://www.markdownguide.org/basic-syntax/',
    'MESSAGES': {
        'delete_confirm': "¿Estás seguro de que quieres eliminar este post y su imagen asociada?",
        'delete_success': "Post eliminado exitosamente",
        'delete_error': "Error al eliminar el post",
        'import_error': "Error al importar el archivo",
        'import_success': "Archivo importado exitosamente"
    },
    'ALLOWED_IMPORT_EXTENSIONS': [
        '.pdf', '.doc', '.docx', '.ppt', '.pptx', 
        '.xls', '.xlsx', '.html', '.txt', '.json', 
        '.xml', '.csv'
    ]
}

@dataclass
class PostData:
    """Clase para almacenar los datos del post"""
    title: str
    description: str  # Texto plano
    content: str      # Contenido con markdown
    author: str
    image_path: str
    image_alt: str
    tags: List[str]
    post_date: str

    def validate(self) -> None:
        """Validar que todos los campos requeridos estén presentes y sean válidos"""
        if not self.title or self.title == "Título del post":
            raise ValueError("El título no puede estar vacío o ser el valor por defecto")
        if not self.author or self.author == "Nombre del autor":
            raise ValueError("El autor no puede estar vacío o ser el valor por defecto")
        if not self.image_path:
            raise ValueError("Debe seleccionar una imagen")
        if not self.tags:
            raise ValueError("Debe especificar al menos un tag")

class PostCreator:
    """Clase responsable de la creación del post"""
    def __init__(self):
        self._setup_directories()

    def _sanitize_filename(self, filename: str) -> str:
        """Sanitizar nombre de archivo para URLs"""
        # Convertir espacios y caracteres especiales a guiones
        filename = re.sub(r'[^\w\s-]', '', filename)
        filename = re.sub(r'[-\s]+', '-', filename.strip())
        # Eliminar caracteres no ASCII
        filename = filename.encode('ascii', 'ignore').decode()
        # Convertir a minúsculas
        return filename.lower()

    def _setup_directories(self) -> None:
        """Crear directorios necesarios si no existen"""
        for directory in [CONFIG['POSTS_DIR'], CONFIG['IMAGES_DIR']]:
            os.makedirs(directory, exist_ok=True)

    def _convert_to_webp(self, image_path: str) -> str:
        """Convertir imagen a formato WebP"""
        try:
            image = Image.open(image_path)
            # Generar un nombre único basado en timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            base_filename = os.path.splitext(os.path.basename(image_path))[0]
            safe_filename = self._sanitize_filename(base_filename)
            filename = f"{timestamp}_{safe_filename}.webp"
            output_path = os.path.join(CONFIG['IMAGES_DIR'], filename)
            
            # Convertir a RGB si es necesario (para imágenes PNG con transparencia)
            if image.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', image.size, (255, 255, 255))
                background.paste(image, mask=image.split()[-1])
                image = background
            
            image.save(output_path, 'WEBP', quality=85)
            return filename
        except Exception as e:
            logging.error(f"Error al convertir imagen a WebP: {e}")
            raise

    def _copy_image(self, image_path: str) -> str:
        """Copiar y convertir imagen si es necesario"""
        ext = os.path.splitext(image_path)[1].lower()
        
        # Si ya es WebP, crear una copia con nombre único
        if ext == '.webp':
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            base_filename = os.path.splitext(os.path.basename(image_path))[0]
            safe_filename = self._sanitize_filename(base_filename)
            filename = f"{timestamp}_{safe_filename}.webp"
            output_path = os.path.join(CONFIG['IMAGES_DIR'], filename)
            shutil.copy2(image_path, output_path)
            return filename
        
        # Para otros formatos, convertir a WebP
        return self._convert_to_webp(image_path)

    def _generate_markdown(self, post: PostData, image_filename: str) -> str:
        """Generar contenido markdown del post"""
        return f"""---
title: "{post.title}"
postDate: "{post.post_date}"
description: "{post.description}"
author: "{post.author}"
image:
    url: "/images/blog/{image_filename}"
    alt: "{post.image_alt}"
tags: [{', '.join(f'"{tag}"' for tag in post.tags)}]
---

{post.content}
"""

    def create_post(self, post: PostData) -> str:
        """Crear nuevo post y retornar la ruta del archivo creado"""
        try:
            # Validar datos del post
            post.validate()
            
            # Procesar la imagen primero
            image_filename = self._copy_image(post.image_path)
            
            # Crear el archivo del post
            post_path = self._create_post_file(post, image_filename)
            
            return post_path
            
        except Exception as e:
            logging.error(f"Error al crear post: {e}")
            raise CreatePostError(f"Error al crear post: {str(e)}")

    def _create_post_file(self, post: PostData, image_filename: str) -> str:
        """Crear el archivo del post y retornar su ruta"""
        safe_title = self._sanitize_filename(post.title)
        date = datetime.now().strftime("%Y-%m-%d")
        post_filename = f"{date}-{safe_title}.md"
        
        final_path = self._get_unique_filepath(
            os.path.join(CONFIG['POSTS_DIR'], post_filename)
        )
        
        content = self._generate_markdown(post, image_filename)
        self._write_post_file(final_path, content)
        
        return final_path

    def _get_unique_filepath(self, base_path: str) -> str:
        """Obtener una ruta de archivo única"""
        final_path = base_path
        counter = 1
        while os.path.exists(final_path):
            name, ext = os.path.splitext(base_path)
            final_path = f"{name}_{counter}{ext}"
            counter += 1
        return final_path

    def _write_post_file(self, path: str, content: str) -> None:
        """Escribir el contenido del post en un archivo"""
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

class PostManager:
    """Clase para gestionar operaciones con posts existentes"""
    def __init__(self):
        self.posts_dir = CONFIG['POSTS_DIR']
        self.images_dir = CONFIG['IMAGES_DIR']

    def get_posts(self) -> List[Dict[str, str]]:
        """Obtener lista de posts existentes"""
        posts = []
        for file in os.listdir(self.posts_dir):
            if file.endswith('.md'):
                with open(os.path.join(self.posts_dir, file), 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Extraer título y fecha del frontmatter
                    title_match = re.search(r'title: "(.*)"', content)
                    date_match = re.search(r'postDate: "(.*)"', content)
                    image_match = re.search(r'url: "(.*)"', content)
                    
                    if title_match and date_match:
                        posts.append({
                            'file': file,
                            'title': title_match.group(1),
                            'date': date_match.group(1),
                            'image': image_match.group(1) if image_match else None
                        })
        return sorted(posts, key=lambda x: x['date'], reverse=True)

    def delete_post(self, post: Dict[str, str]) -> bool:
        """Eliminar un post y su imagen asociada"""
        try:
            # Eliminar archivo markdown
            md_path = os.path.join(self.posts_dir, post['file'])
            if os.path.exists(md_path):
                os.remove(md_path)

            # Eliminar imagen si existe
            if post['image']:
                image_name = os.path.basename(post['image'])
                image_path = os.path.join('public', post['image'].lstrip('/'))
                if os.path.exists(image_path):
                    os.remove(image_path)

            return True
        except Exception as e:
            logging.error(f"Error al eliminar post: {e}")
            return False

class PostUploaderGUI:
    """Clase responsable de la interfaz de usuario"""
    def __init__(self):
        self._setup_logging()
        self.post_creator = PostCreator()
        self.post_manager = PostManager()
        self._setup_window()
        self._setup_ui()
        self.image_path: Optional[str] = None
        self.upload_button = None  # Inicializamos upload_button como None
        self.deploy_button = None  # Inicializamos deploy_button como None
        self.current_post_path = None  # Para guardar la ruta del post creado
        self.md_converter = MarkItDown()

    def _setup_logging(self) -> None:
        """Configurar sistema de logging"""
        logging.basicConfig(
            filename=CONFIG['LOG_FILE'],
            level=logging.DEBUG,
            format='%(asctime)s:%(levelname)s:%(message)s'
        )

    def _setup_window(self) -> None:
        """Configurar ventana principal con tema oscuro"""
        self.root = tk.Tk()
        self.root.title("Editor de Posts")
        self.root.geometry(CONFIG['WINDOW_SIZE'])
        self.root.configure(bg=CONFIG['COLORS']['background'])
        
        # Configurar estilos
        style = ttk.Style()
        style.configure('Dark.TFrame', background=CONFIG['COLORS']['background'])
        style.configure('Surface.TFrame', background=CONFIG['COLORS']['surface'])
        
        # Estilo para Entry
        style.configure('Dark.TEntry',
            fieldbackground=CONFIG['COLORS']['input_bg'],
            foreground=CONFIG['COLORS']['input_fg'],
            insertcolor=CONFIG['COLORS']['text'],
            selectbackground=CONFIG['COLORS']['selection_bg'],
            selectforeground=CONFIG['COLORS']['text']
        )
        
        # Estilo para botones
        style.configure('Dark.TButton',
            background=CONFIG['COLORS']['primary'],
            foreground=CONFIG['COLORS']['text'],
            font=CONFIG['FONTS']['main'],
            padding=10
        )
        style.map('Dark.TButton',
            background=[
                ('disabled', CONFIG['COLORS']['button_disabled']),
                ('active', CONFIG['COLORS']['hover'])
            ],
            foreground=[
                ('disabled', CONFIG['COLORS']['text_secondary'])
            ]
        )
        
        # Estilo para pestañas
        style.configure('Dark.TNotebook.Tab',
            background=CONFIG['COLORS']['surface'],
            foreground=CONFIG['COLORS']['text'],
            padding=[10, 5]
        )
        style.map('Dark.TNotebook.Tab',
            background=[('selected', CONFIG['COLORS']['input_bg'])]
        )
        
        # Configurar estilo para labels
        style.configure('Dark.TLabel',
            background=CONFIG['COLORS']['label_bg'],
            foreground=CONFIG['COLORS']['text'],
            font=CONFIG['FONTS']['main']
        )

        # Configurar menú con colores oscuros
        self._setup_menu()

    def _setup_menu(self) -> None:
        """Configurar barra de menú"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        # Menú Archivo
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Archivo", menu=file_menu)
        file_menu.add_command(label="Nuevo Post", command=self._clear_form)
        file_menu.add_command(label="Importar Archivo", command=self._import_file)
        file_menu.add_separator()
        file_menu.add_command(label="Salir", command=self.root.quit)

        # Menú Posts
        posts_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Posts", menu=posts_menu)
        posts_menu.add_command(label="Eliminar Post", command=self._show_delete_dialog)

        # Menú Ayuda
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Ayuda", menu=help_menu)
        help_menu.add_command(label="Guía Markdown", command=lambda: webbrowser.open(CONFIG['HELP_URL']))
        help_menu.add_command(label="Acerca de", command=self._show_about)

    def _setup_ui(self) -> None:
        """Configurar elementos de la interfaz con tema oscuro"""
        main_frame = ttk.Frame(self.root, style='Dark.TFrame')
        main_frame.pack(fill='both', expand=True)

        # Notebook con tema oscuro (guardamos referencia para acceso global)
        self.notebook = ttk.Notebook(main_frame, style='Dark.TNotebook')
        self.notebook.pack(pady=10, padx=20, fill='both', expand=True)

        # Pestañas
        metadata_frame = ttk.Frame(self.notebook, style='Surface.TFrame')
        content_frame = ttk.Frame(self.notebook, style='Surface.TFrame')
        self.notebook.add(metadata_frame, text='Metadata')
        self.notebook.add(content_frame, text='Contenido')
        
        self._setup_metadata_frame(metadata_frame)
        self._setup_content_frame(content_frame)

        # Barra de acciones minimalista
        action_frame = ttk.Frame(main_frame, style='Dark.TFrame')
        action_frame.pack(side='bottom', fill='x', padx=20, pady=10)

        self.upload_button = ttk.Button(
            action_frame,
            text="✓ Crear",
            command=self._handle_post_creation,
            style='Dark.TButton',
            width=15
        )
        self.upload_button.pack(side='left', padx=5)

        self.deploy_button = ttk.Button(
            action_frame,
            text="↑ Publicar",
            command=self._handle_deployment,
            style='Dark.TButton',
            state='disabled',
            width=15
        )
        self.deploy_button.pack(side='left', padx=5)

        self.progress = ttk.Progressbar(
            action_frame,
            orient='horizontal',
            length=200,
            mode='indeterminate'
        )
        self.progress.pack(side='right', padx=5)

    def _setup_metadata_frame(self, frame: ttk.Frame) -> None:
        """Configurar campos de metadata con tema oscuro"""
        self.entries = {}
        
        # Campos con sus valores por defecto
        fields = {
            'Título:': 'Título del post',
            'Fecha:': datetime.now().strftime("%Y-%m-%d"),  # Fecha actual por defecto
            'Autor:': 'Nombre del autor',
            'Tags:': 'tag1, tag2, tag3',
            'Alt:': 'Descripción de la imagen'
        }
        
        row = 0
        for label, placeholder in fields.items():
            label_widget = ttk.Label(
                frame,
                text=label,
                style='Dark.TLabel'
            )
            label_widget.grid(row=row, column=0, sticky='w', pady=5, padx=10)
            
            entry = ttk.Entry(frame, 
                width=50,
                style='Dark.TEntry'
            )
            entry.grid(row=row, column=1, pady=5, padx=10, sticky='ew')
            entry.insert(0, placeholder)
            # Solo añadimos el evento de click si no es el campo de fecha
            if label != 'Fecha:':
                entry.bind('<FocusIn>', lambda e, entry=entry, ph=placeholder: 
                    self._on_entry_click(entry, ph))
                # Añadimos evento de FocusOut para restaurar el placeholder si está vacío
                entry.bind('<FocusOut>', lambda e, entry=entry, ph=placeholder:
                    self._on_entry_leave(entry, ph))
            
            self.entries[label] = entry
            row += 1

        # Descripción
        desc_label = ttk.Label(
            frame,
            text="Descripción:",
            style='Dark.TLabel'
        )
        desc_label.grid(row=row, column=0, sticky='nw', pady=5, padx=10)
        
        self.entries['Descripción:'] = scrolledtext.ScrolledText(
            frame,
            height=3,
            width=48,
            bg=CONFIG['COLORS']['input_bg'],
            fg=CONFIG['COLORS']['input_fg'],
            insertbackground=CONFIG['COLORS']['text'],
            selectbackground=CONFIG['COLORS']['selection_bg'],
            selectforeground=CONFIG['COLORS']['text'],
            relief='flat'
        )
        self.entries['Descripción:'].grid(row=row, column=1, pady=5, padx=10)

        # Botón de imagen minimalista
        self.image_button = ttk.Button(
            frame,
            text="📷 Imagen",
            command=self._select_image,
            style='Dark.TButton'
        )
        self.image_button.grid(row=row+1, column=0, columnspan=2, pady=10)
        
        self.image_label = ttk.Label(
            frame,
            text="Sin imagen seleccionada",
            style='Dark.TLabel'
        )
        self.image_label.grid(row=row+2, column=0, columnspan=2)

    def _setup_content_frame(self, frame: ttk.Frame) -> None:
        """Configurar editor de contenido con tema oscuro"""
        self.entries['Contenido:'] = scrolledtext.ScrolledText(
            frame,
            height=25,
            width=80,
            font=CONFIG['FONTS']['code'],
            bg=CONFIG['COLORS']['input_bg'],
            fg=CONFIG['COLORS']['input_fg'],
            insertbackground=CONFIG['COLORS']['text'],
            selectbackground=CONFIG['COLORS']['selection_bg'],
            selectforeground=CONFIG['COLORS']['text'],
            relief='flat'
        )
        self.entries['Contenido:'].pack(pady=10, padx=10, fill='both', expand=True)

        # Barra de herramientas minimalista
        toolbar = ttk.Frame(frame, style='Surface.TFrame')
        toolbar.pack(fill='x', pady=5, padx=10)
        
        markdown_buttons = [
            ('B', '**texto**'),
            ('I', '*texto*'),
            ('🔗', '[texto](url)'),
            ('< >', '```\ncódigo\n```'),
            ('•', '- item'),
        ]

        for text, markdown in markdown_buttons:
            ttk.Button(
                toolbar,
                text=text,
                command=lambda m=markdown: self._insert_markdown(m),
                style='Dark.TButton',
                width=3
            ).pack(side='left', padx=2)

    def _on_entry_click(self, entry: ttk.Entry, placeholder: str) -> None:
        """Manejar el comportamiento de placeholder"""
        if entry.get() == placeholder:
            entry.delete(0, tk.END)
            # Los widgets ttk.Entry no usan config() para cambiar colores
            # El color se maneja a través del estilo
            style = ttk.Style()
            style.configure('Dark.TEntry', foreground=CONFIG['COLORS']['text'])

    def _on_entry_leave(self, entry: ttk.Entry, placeholder: str) -> None:
        """Restaurar placeholder si el campo está vacío"""
        if entry.get().strip() == '':
            entry.insert(0, placeholder)
            style = ttk.Style()
            style.configure('Dark.TEntry', foreground=CONFIG['COLORS']['input_fg'])

    def _create_tooltip(self, widget: tk.Widget, text: str) -> None:
        """Crear tooltip para un widget"""
        def show_tooltip(event):
            tooltip = tk.Toplevel()
            tooltip.wm_overrideredirect(True)
            tooltip.wm_geometry(f"+{event.x_root+10}+{event.y_root+10}")
            
            label = ttk.Label(
                tooltip,
                text=text,
                background=CONFIG['COLORS']['surface'],
                foreground=CONFIG['COLORS']['text'],
                relief='solid',
                borderwidth=1
            )
            label.pack()
            
            def hide_tooltip():
                tooltip.destroy()
            
            widget.tooltip = tooltip
            widget.bind('<Leave>', lambda e: hide_tooltip())
            
        widget.bind('<Enter>', show_tooltip)

    def _insert_markdown(self, markdown: str) -> None:
        """Insertar texto markdown en el editor"""
        self.entries['Contenido:'].insert(tk.INSERT, markdown)

    def _set_default_values(self) -> None:
        """Establecer valores por defecto en los campos"""
        defaults = {
            'Título:': 'Título del post',
            'Fecha:': datetime.now().strftime("%Y-%m-%d"),
            'Autor:': 'Nombre del autor',
            'Tags:': 'tag1, tag2, tag3',
            'Alt:': 'Descripción de la imagen'
        }
        
        for field, value in defaults.items():
            if field in self.entries:
                if isinstance(self.entries[field], (tk.Entry, ttk.Entry)):
                    self.entries[field].delete(0, tk.END)
                    self.entries[field].insert(0, value)

    def _clear_form(self) -> None:
        """Limpiar todos los campos del formulario"""
        for entry in self.entries.values():
            if isinstance(entry, (tk.Entry, ttk.Entry)):
                entry.delete(0, tk.END)
            elif isinstance(entry, (tk.Text, scrolledtext.ScrolledText)):
                entry.delete('1.0', tk.END)
        
        self.image_path = None
        self.image_label.config(text="No se ha seleccionado imagen")
        self._set_default_values()

    def _show_about(self) -> None:
        """Mostrar ventana Acerca de"""
        messagebox.showinfo(
            "Acerca de",
            "Editor de Posts - Blog\n\n"
            "Una herramienta para crear y publicar posts en el blog.\n"
            "Versión 1.0"
        )

    def _select_image(self) -> None:
        """Manejar selección de imagen"""
        self.image_path = filedialog.askopenfilename(
            title="Selecciona la imagen",
            filetypes=[
                ("Imágenes", " ".join(f"*{ext}" for ext in CONFIG['ALLOWED_EXTENSIONS']))
            ]
        )
        if self.image_path:
            filename = os.path.basename(self.image_path)
            if os.path.splitext(filename)[1].lower() not in CONFIG['ALLOWED_EXTENSIONS']:
                messagebox.showerror("Error", "Formato de imagen no soportado")
                self.image_path = None
                return
            self.image_label.config(text=f"Imagen seleccionada: {filename}")

    def _get_post_data(self) -> Optional[PostData]:
        """Recopilar datos del post desde la interfaz"""
        try:
            # Primero verificamos que todos los campos existen
            required_fields = ['Título:', 'Descripción:', 'Contenido:', 'Autor:', 'Alt:', 'Tags:', 'Fecha:']
            for field in required_fields:
                if field not in self.entries:
                    logging.error(f"Campo requerido no encontrado: {field}")
                    raise KeyError(f"Campo faltante: {field}")

            tags = [tag.strip() for tag in self.entries['Tags:'].get().split(',') if tag.strip()]
            
            # Verificamos que haya al menos un tag
            if not tags:
                raise ValueError("Debe especificar al menos un tag")

            post_data = PostData(
                title=self.entries['Título:'].get().strip(),
                description=self.entries['Descripción:'].get("1.0", tk.END).strip(),
                content=self.entries['Contenido:'].get("1.0", tk.END).strip(),
                author=self.entries['Autor:'].get().strip(),
                image_path=self.image_path if self.image_path else "",
                image_alt=self.entries['Alt:'].get().strip(),
                tags=tags,
                post_date=self.entries['Fecha:'].get().strip()
            )

            # Validación adicional de los datos
            post_data.validate()

            return post_data

        except (KeyError, ValueError) as e:
            messagebox.showerror("Error de validación", str(e))
            logging.error(f"Error de validación: {e}")
            return None
        except Exception as e:
            logging.error(f"Error inesperado al recopilar datos: {e}")
            messagebox.showerror("Error", f"Error al recopilar datos del post:\n{str(e)}")
            return None

    def _handle_post_creation(self) -> None:
        """Manejar el proceso de creación del post"""
        try:
            self._start_processing()
            
            post_data = self._get_post_data()
            if not post_data:
                return

            self.current_post_path = self.post_creator.create_post(post_data)
            
            self._show_success_message("Post creado exitosamente")
            self._enable_deploy_button()

        except Exception as e:
            self._handle_error("Error al crear el post", e)
        finally:
            self._end_processing()

    def _handle_deployment(self) -> None:
        """Manejar el proceso de despliegue"""
        try:
            self._start_deployment()
            
            if not self._confirm_deployment():
                return
                
            if self._deploy_to_production():
                self._show_success_message("Despliegue completado exitosamente")
            else:
                self._show_error_message("Error durante el despliegue")
                
        except Exception as e:
            self._handle_error("Error en el despliegue", e)
        finally:
            self._end_deployment()

    def _start_processing(self) -> None:
        """Iniciar procesamiento y deshabilitar botones"""
        self.progress.start()
        if self.upload_button:
            self.upload_button.config(state='disabled')
        if self.deploy_button:
            self.deploy_button.config(state='disabled')

    def _end_processing(self) -> None:
        """Finalizar procesamiento y restaurar botones"""
        self.progress.stop()
        if self.upload_button:
            self.upload_button.config(state='normal')
        # Habilitar el botón de publicar si hay un post creado
        if self.deploy_button and self.current_post_path:
            self.deploy_button.config(state='normal')

    def _deploy_to_production(self) -> bool:
        """Ejecutar comandos de despliegue"""
        try:
            # Cambiar al directorio del repositorio
            original_dir = os.getcwd()
            os.chdir(CONFIG['REPO_DIR'])

            # Lista para almacenar el estado de cada comando
            commands_status = []
            
            # Git status para verificar cambios
            status_result = subprocess.run(
                ['git', 'status', '--porcelain'],
                capture_output=True,
                text=True
            )
            
            if status_result.stdout.strip():
                # Hay cambios, proceder con add y commit
                add_result = subprocess.run(
                    ['git', 'add', '.'],
                    capture_output=True,
                    text=True
                )
                if add_result.returncode != 0:
                    raise DeploymentError(f"Error en git add: {add_result.stderr}")
                
                commit_result = subprocess.run(
                    ['git', 'commit', '-m', 'Nuevo post añadido'],
                    capture_output=True,
                    text=True
                )
                if commit_result.returncode != 0:
                    raise DeploymentError(f"Error en git commit: {commit_result.stderr}")
                
                push_result = subprocess.run(
                    ['git', 'push', 'origin', 'main'],
                    capture_output=True,
                    text=True
                )
                if push_result.returncode != 0:
                    raise DeploymentError(f"Error en git push: {push_result.stderr}")
                
                commands_status.extend([True, True, True])
            else:
                # No hay cambios para commit
                logging.info("No hay cambios para commit")
                commands_status.extend([True, True, True])

            # Ejecutar npm run build
            build_result = subprocess.run(
                'npm run build',
                capture_output=True,
                text=True,
                shell=True,
                cwd=CONFIG['REPO_DIR']
            )
            if build_result.returncode != 0:
                raise DeploymentError(f"Error en npm build: {build_result.stderr}")
            commands_status.append(True)

            # Ejecutar npm run deploy
            deploy_result = subprocess.run(
                'npm run deploy',
                capture_output=True,
                text=True,
                shell=True,
                cwd=CONFIG['REPO_DIR']
            )
            if deploy_result.returncode != 0:
                raise DeploymentError(f"Error en npm deploy: {deploy_result.stderr}")
            commands_status.append(True)

            # Restaurar directorio original
            os.chdir(original_dir)
            
            # Todo el proceso fue exitoso si todos los comandos lo fueron
            return all(commands_status)

        except DeploymentError as e:
            logging.error(f"Error en el despliegue: {str(e)}")
            messagebox.showerror("Error de Despliegue", str(e))
            return False
        except Exception as e:
            logging.error(f"Error inesperado en el despliegue: {e}")
            messagebox.showerror("Error", f"Error inesperado durante el despliegue:\n{str(e)}")
            return False
        finally:
            # Asegurarse de volver al directorio original
            if 'original_dir' in locals():
                os.chdir(original_dir)

    def _show_error_message(self, message: str) -> None:
        """Mostrar mensaje de error"""
        messagebox.showerror("Error", message)
        logging.error(message)

    def _handle_error(self, message: str, exception: Exception) -> None:
        """Manejar errores y mostrar mensajes"""
        logging.error(f"{message}: {exception}")
        messagebox.showerror("Error", f"{message}:\n{str(exception)}")

    def _show_success_message(self, message: str) -> None:
        """Mostrar mensaje de éxito"""
        messagebox.showinfo("Éxito", message)

    def _enable_deploy_button(self) -> None:
        """Habilitar botón de despliegue"""
        if self.deploy_button:
            self.deploy_button.config(state='normal')

    def _start_deployment(self) -> None:
        """Iniciar despliegue y deshabilitar botones"""
        self.progress.start()
        if self.deploy_button:
            self.deploy_button.config(state='disabled')

    def _end_deployment(self) -> None:
        """Finalizar despliegue y restaurar botones"""
        self.progress.stop()
        if self.deploy_button:
            self.deploy_button.config(state='normal')

    def _confirm_deployment(self) -> bool:
        """Confirmar despliegue"""
        return messagebox.askyesno("Confirmar", "¿Estás seguro de que quieres desplegar a producción?")

    def _show_delete_dialog(self) -> None:
        """Mostrar diálogo para eliminar posts"""
        dialog = tk.Toplevel(self.root)
        dialog.title("Eliminar Post")
        dialog.geometry("500x500")  # Aumentado el alto de la ventana
        dialog.configure(bg=CONFIG['COLORS']['background'])
        
        # Hacer el diálogo modal y centrarlo
        dialog.transient(self.root)
        dialog.grab_set()
        
        # Centrar la ventana
        dialog.update_idletasks()
        width = dialog.winfo_width()
        height = dialog.winfo_height()
        x = (dialog.winfo_screenwidth() // 2) - (width // 2)
        y = (dialog.winfo_screenheight() // 2) - (height // 2)
        dialog.geometry(f'+{x}+{y}')

        # Frame principal con padding
        frame = ttk.Frame(dialog, style='Dark.TFrame')
        frame.pack(fill='both', expand=True, padx=10, pady=10)

        # Lista de posts
        posts = self.post_manager.get_posts()
        listbox = tk.Listbox(
            frame,
            bg=CONFIG['COLORS']['input_bg'],
            fg=CONFIG['COLORS']['text'],
            selectmode=tk.SINGLE,
            font=CONFIG['FONTS']['main'],
            height=15
        )
        listbox.pack(fill='both', expand=True, pady=5)

        # Poblar lista
        for post in posts:
            listbox.insert(tk.END, f"{post['date']} - {post['title']}")

        def delete_selected():
            selection = listbox.curselection()
            if not selection:
                return
            
            post = posts[selection[0]]
            
            # Liberar el control modal y esperar respuesta
            dialog.grab_release()
            dialog.withdraw()  # Ocultar diálogo temporalmente
            
            confirm = messagebox.askyesno(
                "Confirmar",
                CONFIG['MESSAGES']['delete_confirm'],
                parent=dialog
            )
            
            if confirm:
                if self.post_manager.delete_post(post):
                    messagebox.showinfo(
                        "Éxito",
                        CONFIG['MESSAGES']['delete_success'],
                        parent=dialog
                    )
                    dialog.destroy()
                else:
                    dialog.deiconify()  # Mostrar diálogo nuevamente
                    messagebox.showerror(
                        "Error",
                        CONFIG['MESSAGES']['delete_error'],
                        parent=dialog
                    )
            else:
                dialog.deiconify()  # Mostrar diálogo si no se confirma
                dialog.grab_set()  # Recuperar el control modal

        # Frame para botones con padding
        button_frame = ttk.Frame(frame, style='Dark.TFrame')
        button_frame.pack(fill='x', pady=10)  # Aumentado el padding vertical

        # Botones con más espacio
        ttk.Button(
            button_frame,
            text="Eliminar",
            command=delete_selected,
            style='Dark.TButton',
            width=15  # Ancho fijo para los botones
        ).pack(side='left', padx=5)

        ttk.Button(
            button_frame,
            text="Cancelar",
            command=dialog.destroy,
            style='Dark.TButton',
            width=15  # Ancho fijo para los botones
        ).pack(side='right', padx=5)

        # Hacer que la ventana no sea redimensionable
        dialog.resizable(False, False)
        
        # Esperar hasta que se cierre el diálogo
        self.root.wait_window(dialog)

    def _import_file(self) -> None:
        """Importar archivo y convertirlo a markdown"""
        file_path = filedialog.askopenfilename(
            title="Selecciona el archivo a importar",
            filetypes=[("Archivos soportados", 
                " ".join(f"*{ext}" for ext in CONFIG['ALLOWED_IMPORT_EXTENSIONS']))]
        )
        
        if not file_path:
            return

        try:
            self.progress.start()
            
            # Convertir archivo a markdown
            result = self.md_converter.convert(file_path)
            
            if result.text_content:
                # Limpiar contenido actual y establecer valores por defecto
                self._clear_form()
                
                # Sobrescribir título con el nombre del archivo
                title = os.path.splitext(os.path.basename(file_path))[0]
                self.entries['Título:'].delete(0, tk.END)
                self.entries['Título:'].insert(0, title.title())
                
                # Insertar contenido convertido
                self.entries['Contenido:'].insert('1.0', result.text_content)
                
                messagebox.showinfo("Éxito", CONFIG['MESSAGES']['import_success'])
                
                # Cambiar a la pestaña de contenido para edición
                self.notebook.select(1)
            else:
                messagebox.showerror("Error", "El archivo no contiene texto convertible")

        except Exception as e:
            logging.error(f"Error al importar archivo: {e}")
            messagebox.showerror("Error", f"{CONFIG['MESSAGES']['import_error']}: {str(e)}")
        finally:
            self.progress.stop()

    def run(self) -> None:
        """Iniciar la aplicación"""
        try:
            self.root.mainloop()
        except Exception as e:
            messagebox.showerror("Error Fatal", f"Error en la aplicación: {e}")
            sys.exit(1)

# Nuevas clases de excepciones personalizadas
class CreatePostError(Exception):
    """Excepción para errores en la creación de posts"""
    pass

class DeploymentError(Exception):
    """Excepción para errores en el despliegue"""
    pass

def check_dependencies():
    """Verificar que todas las dependencias estén instaladas"""
    try:
        import markitdown
        import PIL
        return True
    except ImportError as e:
        print(f"Error: Faltan dependencias. Por favor, ejecute setup.py primero: {e}")
        return False

if __name__ == "__main__":
    if check_dependencies():
        app = PostUploaderGUI()
        app.run()
    else:
        sys.exit(1)
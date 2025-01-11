import os
import subprocess
import sys
import venv
from pathlib import Path


def setup_environment():
    """Configurar entorno virtual e instalar dependencias"""
    venv_path = Path("venv")
    
    # Crear venv si no existe
    if not venv_path.exists():
        print("Creando entorno virtual...")
        venv.create(venv_path, with_pip=True)
    
    # Determinar el path del ejecutable de Python del venv
    if sys.platform == "win32":
        python_path = venv_path / "Scripts" / "python.exe"
        pip_path = venv_path / "Scripts" / "pip.exe"
    else:
        python_path = venv_path / "bin" / "python"
        pip_path = venv_path / "bin" / "pip"

    # Verificar e instalar dependencias
    try:
        # Actualizar pip
        subprocess.run([str(pip_path), "install", "--upgrade", "pip"], check=True)
        
        # Instalar dependencias
        requirements = Path("requirements.txt")
        if requirements.exists():
            print("Instalando dependencias...")
            subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], check=True)
        
        print("Entorno configurado correctamente")
        return str(python_path)
    except subprocess.CalledProcessError as e:
        print(f"Error al configurar el entorno: {e}")
        sys.exit(1)

if __name__ == "__main__":
    python_path = setup_environment()
    
    # Ejecutar la aplicación principal
    try:
        subprocess.run([python_path, "setup.py"])
    except KeyboardInterrupt:
        print("\nAplicación cerrada")
    except Exception as e:
        print(f"Error al ejecutar la aplicación: {e}")

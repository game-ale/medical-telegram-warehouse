import os
import sys
import subprocess
from dotenv import load_dotenv

# Load .env from project root
# Script is in scripts/, so .../ is root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path)

# Ensure DB_PORT is set
if not os.getenv("DB_PORT"):
    os.environ["DB_PORT"] = "5432"

# Change to dbt project dir
dbt_dir = os.path.join(project_root, 'medical_warehouse')
os.chdir(dbt_dir)

# Run dbt
cmd = ['dbt'] + sys.argv[1:]
print(f"Running: {' '.join(cmd)}")

try:
    subprocess.run(cmd, check=True, shell=True)
except subprocess.CalledProcessError as e:
    sys.exit(e.returncode)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

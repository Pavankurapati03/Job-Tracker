import sys
import os

# Insert the parent directory (backend root) to sys.path so tests can find main.py, etc.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

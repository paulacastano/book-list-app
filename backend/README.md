## COMANDOS

- Cargar la variable de entorno

```
$Env:BOOKS_DB_URL="postgresql://paula:1234@localhost:5434/books_db"
$Env:USERS_DB_URL="postgresql://paula:1234@localhost:5433/users_db"
```

- Activar entorno virtual:

```bash
.venv\Scripts\Activate.ps1
```

- Levantar servidor en modo desarrollo:

```bash
fastapi dev main.py
```

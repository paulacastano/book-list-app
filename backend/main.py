from typing import Annotated
import os
from users import create_users_db_and_tables, router
from pydantic import BaseModel
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi.middleware.cors import CORSMiddleware


class Book(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    author: str = Field(index=True)
    description: str
    year: int

database_url = os.getenv("BOOKS_DB_URL")

engine = create_engine(database_url)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine, tables=[SQLModel.metadata.tables["book"]])


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


# Configurar CORS
origins = [
    "http://localhost:4200",  # frontend local
    # Puedes añadir más orígenes si necesitas
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # permite sólo estos orígenes
    allow_credentials=True,
    allow_methods=["*"],              # permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],              # permite todos los headers
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    create_users_db_and_tables()


@app.post("/books/")
def create_book(book: Book, session: SessionDep) -> Book:
    session.add(book)
    session.commit()
    session.refresh(book)
    return book

@app.put("/books/{book_id}")
def update_book(book_id: int, book: Book, session: SessionDep) -> Book:
    existing_book = session.get(Book, book_id)
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book.id = book_id
    session.merge(book)
    session.commit()
    return book


@app.get("/books/")
def read_books(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Book]:
    books = session.exec(select(Book).offset(offset).limit(limit)).all()
    return books


@app.get("/books/{book_id}")
def read_book(book_id: int, session: SessionDep) -> Book:
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.delete("/books/{book_id}")
def delete_book(book_id: int, session: SessionDep):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    session.delete(book)
    session.commit()
    return {"ok": True}

app.include_router(router, prefix="/users", tags=["users"])
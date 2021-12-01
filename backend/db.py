from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

class DB:
    """Hosts all functions for querying the database."""

    def __init__(self, app):
        db = SQLAlchemy(app)
        self.session = db.session

    # User must call db.session.commit() on their own for INSERT, UPDATE, DELETE
    def execute(self, sqlstr, **kwargs):
        """Execute sqlstr and return a list of result tuples.  sqlstr will be
        wrapped automatically in a
        sqlalchemy.sql.expression.TextClause.  You can use :param
        inside sqlstr and supply its value as a kwarg.  See
        https://docs.sqlalchemy.org/en/14/core/connections.html#sqlalchemy.engine.execute
        https://docs.sqlalchemy.org/en/14/core/sqlelement.html#sqlalchemy.sql.expression.text
        https://docs.sqlalchemy.org/en/14/core/connections.html#sqlalchemy.engine.CursorResult
        for additional details.  See models/*.py for examples of
        calling this function."""
        res = self.session.execute(text(sqlstr), kwargs).fetchall()
        return [dict(row) for row in res]


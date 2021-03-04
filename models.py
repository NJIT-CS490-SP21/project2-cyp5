def user_class(db):
    class Person(db.Model):
        #id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), primary_key=True, nullable=False)
        score = db.Column(db.Integer, unique=False, nullable=False)
    
        def __repr__(self):
            return '<Person %r>' % self.username
    return Person
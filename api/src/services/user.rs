use mongodb::{
    bson::{doc, oid::ObjectId, Document},
    error::Error as MongoError,
    Collection,
};

pub struct UserService {
    db: Collection,
}

impl UserService {
    pub async fn new(db: Collection) -> Self {
        Self { db }
    }

    pub async fn get_id(&self, id: &ObjectId) -> Result<Document, MongoError> {
        let user = self.db.find_one(doc! {"_id": &id }, None).await?.unwrap();
        Ok(user)
    }
}

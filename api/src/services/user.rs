use mongodb::{
    bson::{doc, oid::ObjectId, Document},
    error::Error as MongoError,
    options::ClientOptions,
    Client, Collection,
};

pub struct UserService {
    db: Collection,
}

impl UserService {
    pub async fn init(mongodb_uri: String, db_name: String, user_collection: String) -> Self {
        let client_options = ClientOptions::parse(&mongodb_uri).await.unwrap();
        let client = Client::with_options(client_options).unwrap();
        let database = client.database(&db_name); //TODO: Add db operations
        let db = database.collection(&user_collection);

        Self { db }
    }

    pub async fn get_id(&self, id: &ObjectId) -> Result<Document, MongoError> {
        let user = self.db.find_one(doc! {"_id": &id }, None).await?.unwrap();
        Ok(user)
    }
}

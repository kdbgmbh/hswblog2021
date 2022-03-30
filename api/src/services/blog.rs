use mongodb::{bson::doc, error::Error as MongoError, options::FindOptions, Collection};
use rocket::futures::StreamExt;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct BlogPost {
    id: i32,
    text: String,
    title: String,
    author: String,
    likes: i32,
    views: i32,
}
#[derive(Clone)]
pub struct BlogService {
    db: Collection<BlogPost>,
}

pub struct BlogEntry {
    id: i32,
    title: String,
    text: String,
    author: String,
}

impl BlogService {
    pub fn new(db: Collection<BlogPost>) -> Self {
        Self { db }
    }

    pub async fn get_posts(&self, name: &String) -> Result<Vec<BlogPost>, MongoError> {
        let find_options = FindOptions::builder().sort(doc! { "name": name }).build();
        let mut posts = self.db.find(None, find_options).await?;

        let mut results: Vec<_> = vec![];

        while let Some(result) = posts.next().await {
            let result = result?;
            results.push(result);
        }
        Ok(results)
    }

    pub async fn add_posts(
        &self,
        id: i32,
        text: String,
        author: String,
        title: String,
    ) -> Result<(), MongoError> {
        let entry = BlogPost {
            id,
            title,
            text,
            author,
            likes: 0,
            views: 0,
        };

        let insert_result = self.db.insert_one(entry.clone(), None).await?;
        println!("New document ID: {}", insert_result.inserted_id);
        Ok(())
    }
}

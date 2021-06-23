mod config;
mod services;

use crate::services::UserService;
use mongodb::{bson::doc, options::ClientOptions, Client};
use rocket::{get, launch, response::NamedFile, routes};
use rocket_contrib::serve::crate_relative;

#[get("/")]
fn index() -> &'static str {
    "OK"
}

#[get("/favicon.ico")]
async fn favicon() -> NamedFile {
    NamedFile::open(crate_relative!("favicon.ico"))
        .await
        .unwrap()
}

#[launch]
async fn rocket() -> _ {
    let app_config = config::Config::init();
    let client_options = ClientOptions::parse(&app_config.mongodb_uri).await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let database = client.database(&app_config.db_name); //TODO: Add db operations
    let user_service = UserService::new(database.collection(&app_config.users));

    rocket::build().mount("/", routes!(index, favicon))
}

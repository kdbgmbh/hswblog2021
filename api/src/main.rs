mod config;

use mongodb::{options::ClientOptions, Client};
use rocket::{get, launch, response::NamedFile, routes};

extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "OK"
}

#[get("/favicon.ico")]
async fn favicon() -> NamedFile {
    let favicon_file = format!("./favicon.ico");
    NamedFile::open(favicon_file).await.unwrap()
}

#[launch]
async fn rocket() -> _ {
    let app_config = config::Config::init();
    let client_options = ClientOptions::parse(&app_config.mongodb_uri).await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let db = client.database(&app_config.collection_name); //TODO: Add db operations

    rocket::build()
        .mount("/", routes![index])
        .mount("/favicon.ico", routes![favicon])
}

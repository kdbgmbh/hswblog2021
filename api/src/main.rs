mod config;
mod services;

use crate::services::UserService;
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
    let db_config = UserService::init(app_config.mongodb_uri, app_config.db_name, app_config.users);
    rocket::build().mount("/", routes!(index, favicon))
}

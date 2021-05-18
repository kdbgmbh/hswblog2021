use serde::Deserialize;
use serde_yaml;
use std::fs::File;
#[derive(Deserialize)]
pub struct Config {
    pub mongodb_uri: String,
    pub users: String,
    pub db_name: String,
}

impl Config {
    pub fn init() -> Self {
        serde_yaml::from_reader(File::open("config.yaml").unwrap()).expect("Unable to open file")
    }
}

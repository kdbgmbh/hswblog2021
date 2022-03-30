use std::time::{SystemTime, UNIX_EPOCH};

use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UserModel {
    pub id: ObjectId,
    pub email: String,
    pub password: String,
    pub token: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct LoginModel {
    pub email: String,
    pub password: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct UserSession {
    sid: ObjectId,
}

impl UserSession {
    pub fn new(sid: ObjectId) -> Self {
        UserSession { sid }
    }
}

impl PartialEq for UserSession {
    fn eq(&self, other: &Self) -> bool {
        self.sid.to_hex() == other.sid.to_hex()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub sid: String,
    pub exp: u64,
}

impl Claims {
    pub fn new(sub: String, sid: String, expires_in: u64) -> Self {
        let created = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        Claims {
            sub,
            sid,
            exp: created + expires_in,
        }
    }
}

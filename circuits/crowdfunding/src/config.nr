use dep::aztec::protocol_types::{address::AztecAddress, traits::Packable};
use std::meta::derive;

#[derive(Eq, Packable)]
pub struct Config {
    pub donation_token: AztecAddress,
    pub operator: AztecAddress,
    pub deadline: u64,
}

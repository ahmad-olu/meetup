import app/pages/home
import app/pages/sign_in
import app/pages/sign_up
import wisp

pub fn home(is_auth: Bool) {
  home.root(is_auth)
}

pub fn signup(req: wisp.Request) {
  sign_up.root(req)
}

pub fn signin(req: wisp.Request) {
  sign_in.root(req)
}

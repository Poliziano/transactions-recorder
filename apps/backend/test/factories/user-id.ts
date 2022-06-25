import KSUID from "ksuid";

export default function randomUserId() {
  return `user_id_${KSUID.randomSync().string}`;
}

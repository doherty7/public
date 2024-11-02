var local = "khmOJXVpqyHvHlk9toTJswSkOv9TCwRqX857mEQWLgYB2vaNgijNkIMZs5PoPanHrnDYL1gfWi4qa+QuZz8Bj8RqARw="
, stageing = "cZvpUA0hW8S9NNVMfmwvWfhg8KP8izLKDyDkP42njaViDmQZWP/ATV2d5uIVS7oPoQLcixweiKwiK5OtDAUL6NkJ+0Onf5jKjFe9bQ=="
, real = "cZvpUA0hW8S9NNVMfmwvWfhg8KP8izLKDyDkP42njaViDmQZWP/ATV2d5uIVS7oPoQLcixweiKwiK5OtDAUL6NkJ+0Onf5jKjFe9bQ==";

var INNORIX_LICENSE = "cZvpUA0hW8S9NNVMfmwvWfhg8KP8izLKDyDkP42njaViDmQZWP/ATV2d5uIVS7oPoQLcixweiKwiK5OtDAUL6NkJ+0Onf5jKjFe9bQ==";
// 라이선스 유형 : INNORIX WP 90일 체험 (만료 2022-06-30)
if (_GLOVALS_ENV === "local" || _GLOVALS_ENV === "local'") {
	INNORIX_LICENSE = local;
} else if (_GLOVALS_ENV === "staging" || _GLOVALS_ENV === "staging'") {
	INNORIX_LICENSE = stageing;
} else {
	INNORIX_LICENSE = real;
}

export function formatLumens (lumens) {
  try {
    var l = lumens.split('.')
    if (!l[0]) {
      l[0] = '0'
    }
    if (!l[1]) {
      l[1] = '0000000'
    }
    return parseInt(l[0]).toLocaleString() + '.' + l[1]
  } catch (e) {
    return 0
  }
}

export function encodeSecretKey (secretKey) {
  try {
    secretKey = secretKey.toLowerCase()
    var _secretKey = secretKey.split('')
    var t = _secretKey[9]
    _secretKey[0] = 'E'
    _secretKey[9] = _secretKey[15]
    _secretKey[15] = t

    return _secretKey.join('')
  } catch (e) {
    return secretKey
  }
}

export function decodeSecretKey (encodedSecretKey) {
  if (encodedSecretKey.startsWith('S')) {
    return encodedSecretKey
  }
  encodedSecretKey = encodedSecretKey.toUpperCase()
  var _secretKey = encodedSecretKey.split('')
  var t = _secretKey[9]
  _secretKey[0] = 'S'
  _secretKey[9] = _secretKey[15]
  _secretKey[15] = t

  return _secretKey.join('')
}

export function copyArray (arr) {
  var ret = []
  for (var i = 0; i < arr.length; i++) {
    ret.push(arr[i])
  }

  return ret
}

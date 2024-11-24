import { normalizeArray, normalizeString } from './NormalizeData.js';
import { capitalizeSentences } from './Utilities.js';
export function combineObjects(obj1, obj2) {
  const combined = { ...obj1 }; // Bắt đầu với obj1 để tránh mất dữ liệu của nó

  // Duyệt qua các thuộc tính của obj2
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      const value1 = obj1[key];
      const value2 = obj2[key];

      // Nếu giá trị trong obj2 khác null, thì cập nhật thuộc tính trong combined
      if (value2) {
        // Nếu giá trị là chuỗi, thì kết hợp chuỗi
        if (typeof value2 === 'string') {
          combined[key] = combineStrings(value1, value2, false);
        } else {
          // Nếu không phải chuỗi hay object, thì lấy giá trị của obj2
          combined[key] = combined[key] ? combined[key] : value2;
        }
      }
    }
  }
  return combined;
}
export function combineStrings(str1, str2, isCombine = true) {
  // Chuẩn hóa chuỗi trước khi kiểm tra
  const normalizedString1 = normalizeString(str1); // Chuẩn hóa string1
  const normalizedString2 = normalizeString(str2); // Chuẩn hóa string2

  // Nếu cả hai chuỗi đều rỗng, trả về chuỗi rỗng
  if (!normalizedString1 && !normalizedString2) return '';

  // Nếu một chuỗi rỗng, trả về chuỗi không rỗng
  if (!normalizedString1) return capitalizeSentences(str2 || '');
  if (!normalizedString2) return capitalizeSentences(str1 || '');

  // Nếu một chuỗi chứa chuỗi kia, trả về chuỗi dài hơn
  if (normalizedString1.includes(normalizedString2))
    return capitalizeSentences(str1);
  if (normalizedString2.includes(normalizedString1))
    return capitalizeSentences(str2);

  // Nếu không có sự liên quan, trả về kết quả nối hai chuỗi
  if (isCombine) {
    return capitalizeSentences(str1 + '\n' + str2);
  }
  return capitalizeSentences(str1.length > str2.length ? str1 : str2);
}
export function combineArrays(arr1, arr2) {
  const normalizedArr1 = normalizeArray(arr1);
  const normalizedArr2 = normalizeArray(arr2);

  const newArr = normalizedArr1.concat(normalizedArr2);

  const uniqueObjects = Array.from(
    new Set(newArr?.map((obj) => JSON.stringify(obj)))
  )?.map((str) => JSON.parse(str));

  return uniqueObjects;
}

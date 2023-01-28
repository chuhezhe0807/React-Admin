const arr = [1, 6, 2, 4, -1, 0, 9, 5, 8, -2];
// 冒泡 快排 归并 选择 插入 计数
function sort(arr) {
    const result = [];
    const counts = [];
    const min = Math.min(...arr);

    for (let value of arr) {
        counts[value - min] = (counts[value - min] || 0) + 1;
    }

    for (let i = 0; i < counts.length; i++) {
        let count = counts[i];
        while (count) {
            result.push(i + min);
            count--;
        }
    }
    return result;
}

console.log(sort(arr));
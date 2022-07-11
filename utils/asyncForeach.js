// CODE ADDED BY UDDIPAN
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
export default asyncForEach;
// CODE ADDED BY UDDIPAN
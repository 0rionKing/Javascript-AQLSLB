function addAll(src, dest) {
    for (var i = 0; i < src.length; i++) {
        dest.push(src[i]);
    }
}


function dist(x1, x2, y1, y2) {
   return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}
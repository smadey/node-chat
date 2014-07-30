var ioServer = require('socket.io');

Date.prototype.format = function(format) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1,  RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
}

module.exports = function(app, server) {

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'home'
        });
    });

    app.get('/hello', function(req, res) {
        res.send('Hello World!');
    });

    app.get('/404', function(req, res) {
        res.render('404');
    });

    app.use(function(req, res) {
        return res.redirect('/404');
    });
};

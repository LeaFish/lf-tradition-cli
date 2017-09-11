/************************************************************
 *              a simple node proxy server                  *
 ************************************************************/



/**************************** DI *********************************/
var proxy = require('http-proxy-middleware');
var path = require('path');
var express = require('express');
var app = express();

/**************************** port *******************************/

app.set('port', process.env.PORT || 3000);

/**************************** view engine ************************/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**************************** static *****************************/

app.use(express.static(__dirname + '/dist'));

/**************************** proxy ******************************/

var options = {
    target: 'http://kqwp.xiaozhangjia.com',         // 目标主机 //唐
    //target: 'http://192.168.2.11:8080',           //延
    changeOrigin: true,                         // 需要虚拟主机站点
};
var exampleProxy = proxy(options);              //开启代理功能，并加载配置
var proxyPath = ['seat','wallet','ticket'];     //转发指定path的请求

proxyPath.forEach(function(item){
    app.use('/' + item + '/*', exampleProxy);
});

/**************************** page enter *************************/

var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
app.use('/', router);

/**************************** 404 ********************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**************************** 500 ********************************/

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**************************** listen *****************************/

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});
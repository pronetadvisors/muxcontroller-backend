import express from 'express';
import passport from 'passport';
import cors from 'cors';
import models from './models';
import helmet from 'helmet';

const app = express();

app.use(express.json());

let port = process.env.PORT || 3000;

// make express look in the public directory for assets (css/js/img)
app.use('/images', express.static(__dirname + '/multer/images/'));


// SECURITY
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');


// force: true will drop the table if it already exits
// models.sequelize.sync({ force: true }).then(() => {
models.sequelize.sync().then(() => {
	console.log('Drop and Resync with {force: true}');
});


// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

//default route
app.get('/', (req, res) => res.send('API Online'));

//DB Routes
require('./routes/user.js')(app);
require('./routes/organization.js')(app);
//Mux Routes
require('./routes/muxStream.js')(app);
require('./routes/muxAsset.js')(app);
//MISC Routes
require('./routes/policyClass.js')(app);

//create a server
var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});
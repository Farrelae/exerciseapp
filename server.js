const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Exercise = require('./models/exercise.js');
const morgan = require('morgan');
const indexRouter = require('./routes/index');
const bcrypt = require("bcrypt")
const session = require("express-session")
const usersRouter = require('./routes/users');

// ----------------------------------------------------------
const SALT_ROUNDS = bcrypt.genSaltSync(10);
const password = 'supersecretpassword';

const hashedString = bcrypt.hashSync(password, SALT_ROUNDS); 

const isMatch = bcrypt.compareSync('yourGuessHere', hashedString); //returns true or false and assigns value to isMatch




mongoose.connect(
	'mongodb+srv://farrelae:stevethefish@cluster0.mylta.mongodb.net/Project2?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	}
);

mongoose.connection.once('open', () => {
	console.log('connected to mongo');
});

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/', indexRouter);


app.use(
	session({
		secret: 'supersecret',
		resave: false,
		saveUninitialized: false,
	})
);



// INDEX
app.get('/exercises', (req, res) => {
	Exercise.find({}, (error, allExercises) => {
		res.render('index', {
			exercises: allExercises,
		});
	});
});

// NEW
app.get('/exercises/new', (req, res) => {
	res.render('new');
});

// DELETE
app.delete('/exercises/:id', (req, res) => {
	Exercise.findByIdAndDelete(req.params.id, (error, data) => {
		res.redirect('/exercises');
	});
});

// UPDATE
app.put('/exercises/:id', (req, res) => {
	if (req.body.isAccessible === 'on') {
		req.body.isAccessible = true;
	} else {
		req.body.isAccessible = false;
	}
	Exercise.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(error, updatedModel) => {
			res.redirect('/exercises');
		}
	);
});

// CREATE
app.post('/exercises', (req, res) => {
	if (req.body.isAccessible === 'on') {
		req.body.isAccessible = true;
	} else {
		req.body.isAccessible = false;
	}

	Exercise.create(req.body, (error, createdExercise) => {
		console.log(createdExercise);
		res.redirect('/exercises');
	});
});

// EDIT
app.get('/exercises/:id/edit', (req, res) => {
	Exercise.findById(req.params.id, (error, foundExercise) => {
		res.render('edit.ejs', {
			exercise: foundExercise,
		});
	});
});

// SHOW

app.get('/exercises/:id', (req, res) => {
	Exercise.findById(req.params.id, (error, foundExercise) => {
		res.render('show', { exercise: foundExercise });
	});
});

app.listen(3000, () => {
	console.log('listening');
});

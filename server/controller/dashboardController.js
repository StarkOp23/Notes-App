const Note = require('../models/Notes');
const mongoose = require('mongoose');


//! Get Dashboard
exports.dashboard = async (req, res) => {

    const locals = {
        title: "Dashboard",
        description: 'Notes Application'
    }

    try {

        const notes = await Note.find({});
        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: '../views/layouts/dashboard'
        });


    } catch (error) {

    }

}


//! View Specific NOte

exports.dashboardViewNote = async (req, res) => {
    try {
        const noteId = new mongoose.Types.ObjectId(req.params.id);
        console.log("Converted Note ID:", noteId);
        console.log("User ID:", req.user.id);

        const note = await Note.findById({ _id: noteId, user: req.user.id }).lean();
        console.log("Found Note:", note);

        if (note) {
            res.render("dashboard/view-notes", {
                noteID: req.params.id,
                note,
                layout: "../views/layouts/dashboard",
            });
        } else {
            console.log("Note not found.");
            res.status(404).send("Note not found.");
        }
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send("Something went wrong.");
    }
};




//! Update Note

exports.dashboardUpdateNote = async (req, res) => {

    console.log("Note ID:", req.params.id);
    console.log("User ID:", req.user.id);

    try {

        const noteId = new mongoose.Types.ObjectId(req.params.id);

        const noteExists = await Note.find({ _id: noteId });
        console.log("Note exists:", noteExists);

        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId },
            { title: req.body.title, body: req.body.body, updatedAt: Date.now() },
            { new: true }

        )

        res.redirect('/dashboard');

        console.log("Note Updated Successfully", updatedNote);

    } catch (error) {
        console.log(error);
    }

}


//! Delete a note
exports.dashboardDeleteNote = async (req, res) => {

    console.log("Note ID:", req.params.id);
    console.log("User ID:", req.user.id);

    try {

        const noteId = new mongoose.Types.ObjectId(req.params.id);

        const noteExists = await Note.findById(noteId);
        console.log("Note exists:", noteExists);

        if (noteExists) {
            await Note.findOneAndDelete(noteId);
            res.redirect('/dashboard');
            console.log('Note deleted successfully');
        } else {
            console.log("Note not found.");
            res.status(404).send("Note not found.");
        }

    } catch (error) {
        console.log(error);
    }

}


//! Add a new note
exports.dashboardAddNote = async (req, res) => {

    console.log("User ID:", req.user.id);

    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard'
    })

}

//! Add a new note after click
exports.dashboardAddNoteSubmit = async (req, res) => {

    console.log("User ID:", req.user.id);

    try {
        req.body.user = req.user.id;
        await Note.create(req.body)
        res.redirect('/dashboard');
        console.log('Note added successfully');

    } catch (error) {
        console.log(error.message);
    }

}

//! Search a note
exports.dashboardSearch = async (req, res) => {

    try {
        res.render('dashboard/search', {
            sarchResults: '',
            layout: '../views/layouts/dashboard'
        })

    } catch (error) {
        console.log(error);
    }
}





//! Search a note after submit

exports.dashboardSearchSubmit = async (req, res) => {

    try {

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
                { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
            ]
        })

        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layouts/dashboard'
        })

    } catch (error) {
        console.log(error);
    }

}
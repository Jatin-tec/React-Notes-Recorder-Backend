const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
var fetchUser = require('../middleware/fetchUser')

//Route 1: to add-note via post @loginrequired
router.post('/add-note', fetchUser, async (req, res)=>{
    try {
    //destructuring title, desc and tag    
    const {title, description, tag} = req.body;

    // creating a new note obj
    const note = new Note({
        title, description, tag, user: req.user.id
    })
    // saving it in db
    const savedNote = await note.save();
    res.json({savedNote});  

    } catch (error) {
        return res.status(500).json({error:'Someting went wrong :('});
    }
})

//Route 2: to get user notes via get @loginrequired
router.get('/get-notes', fetchUser, async (req, res)=>{
    try {
        //getting athenticated user notes
        const notes= await Note.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        return res.status(500).json({error:'Someting went wrong :('});
    }
})

//Route 3: to add update user note via put @loginrequired
router.put('/update-note/:id', fetchUser, async (req, res)=>{
    try {
        const {title, description, tag} = req.body;
        
        //creating new new note object to further update it with exsisting note
        let newNote = {};
        
        //updating note element accordingly
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
 
        //fetching note requested to update
        let note = await Note.findById(req.params.id);
        if(!note){res.status(404).json({"error": "Not found"})};

        //checking if user requesting notes is requesting his own notes 
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        //getting requested note and updating it
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        return res.json({note})

    } catch (error) {
        return res.status(500).json({error:'Someting went wrong :('});
    }
})

//Route 4: to delete user note via delete @loginrequired
router.delete('/delete-note/:id', fetchUser, async (req, res)=>{
    try {
        //fetching note requested to update
        let note = await Note.findById(req.params.id);
        if(!note){res.status(404).json({"error": "Not found"})};

        //checking if user requesting notes is requesting his own notes 
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        //getting requested note and updating it
        note = await Note.findByIdAndDelete(req.params.id);
        return res.json({msg: 'Note deleted successfully', note: note})

    } catch (error) {
        return res.status(500).json({error:'Someting went wrong :('});
    }
})

module.exports = router;

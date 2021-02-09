const mongoose = require('mongoose');
const {Schema} = mongoose;


const ProjectDataSchema = new Schema({
  userid: String,
  // Schema.Types.Mixed is used because the scene dat
  // in the form of an array hashmap
  // as per mongoose documentation: "an anything-goes datatype,
  // its flexibility comes
  // at a trade-off of it being harder to maintain
  projectname: {type: String},
  projectdata: {type: Schema.Types.Mixed},
  DateCreated: {type: Date, default: Date.now},
  LastModified: {type: Date},
});
ProjectDataSchema
    .methods
    .isProjectNameUnique = function(candidateProject, cb) {
      return this.model('ProjectDataModule')
          .countDocuments(
              {username: this.username, projectname: candidateProject},
              cb,
          );
    };
// export this module so Node can use it anywhere it wants
module.exports = mongoose.model('ProjectDataModule', ProjectDataSchema);

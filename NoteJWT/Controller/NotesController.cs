using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NoteWithJWT.Data;
using NoteWithJWT.Models.DomainModels;
using NoteWithJWT.Models.DTO;

namespace NoteWithJWT.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly NotesDbContext dbContext;
        public NotesController(NotesDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpPost]
        public IActionResult AddNote(AddNoteRequest addNoteRequest)
        {
            //Convert DTO to Domain Model
            var note = new Models.DomainModels.Note
            {
                Title = addNoteRequest.Title,
                Description = addNoteRequest.Description,
                ColorHex = addNoteRequest.ColorHex,
                DateCreated = DateTime.Now
            };
            dbContext.Notes.Add(note);
            dbContext.SaveChanges();
            return Ok(note);
        }
        [HttpGet]
        public IActionResult GetAllNotes()
        {
           var notes =  dbContext.Notes.ToList();
           var NoteDTO = new List<Models.DTO.Note>();
            foreach(var note in notes)
            {
                NoteDTO.Add(new Models.DTO.Note
                {
                    Id = note.Id,
                    Title = note.Title,
                    Description = note.Description,
                    ColorHex = note.ColorHex,
                    DateCreated = note.DateCreated
                });
            }
            return Ok(NoteDTO);
        }

        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetById(Guid id)
        {
            var noteDomainObject = dbContext.Notes.Find(id);

            if(noteDomainObject == null)
            {
                return BadRequest();
            }
            else
            {
                var noteDTO = new Models.DTO.Note
                {
                    Id = noteDomainObject.Id,
                    Title = noteDomainObject.Title,
                    Description = noteDomainObject.Description,
                    ColorHex = noteDomainObject.ColorHex,
                    DateCreated = noteDomainObject.DateCreated
                };
                return Ok(noteDTO);
            }

        }

        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateNote(Guid id,UpdateNoteRequest updateNoteRequest)
        {
            var NoteByObject = dbContext.Notes.Find(id);
            if (NoteByObject != null) 
            { 
                NoteByObject.Title = updateNoteRequest.Title;
                NoteByObject.Description = updateNoteRequest.Description;
                NoteByObject.ColorHex = updateNoteRequest.ColorHex;

                dbContext.SaveChanges();
                return Ok(NoteByObject);
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteNote(Guid id) 
        {
            var note = dbContext.Notes.Find(id);
            if (note != null)
            {
                dbContext.Notes.Remove(note);
                dbContext.SaveChanges();
                return Ok();
            }
            return BadRequest();
        }
    }
}

use aztec::macros::aztec;

#[aztec]
pub contract IGetNote {
    use aztec::{
        macros::{functions::{private, utility}, storage::storage},
        messages::logs::note::encode_and_encrypt_note,
        note::note_interface::NoteProperties,
        prelude::{NoteViewerOptions, PrivateSet},
    };
    use value_note::value_note::ValueNote;

    #[storage]
    struct Storage<Context> {
        set: PrivateSet<ValueNote, Context>,
    }

    #[private]
    fn insert_note(value: Field) {
        let sender = context.msg_sender();
        let note = ValueNote::new(value, sender);
        storage.set.insert(note).emit(encode_and_encrypt_note(&mut context, sender, sender));
    }

    #[utility]
    unconstrained fn read_note_values(comparator: u8, value: Field) -> BoundedVec<Field, 10> {
        let notes = storage.set.view_notes(NoteViewerOptions::new().select(
            ValueNote::properties().value,
            comparator,
            value,
        ));
        notes.map(|note| note.value())
    }
}

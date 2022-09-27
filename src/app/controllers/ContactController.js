const ContactRepository = require('../repositories/ContactRepository');


class ContactController {

  // List ALL contacts.

  async index(request, response) {
    const { orderBy } = request.query;

    const contacts = await ContactRepository.findAll(orderBy);

    response.json(contacts);
  }

  // Get an UNIQUE contact.

  async show(request, response) {
    const { id } = request.params;
    const contact = await ContactRepository.findById(id);
    if(!contact) {
      // 404: Not Found
      return response.json(404, { err: 'User not found'});
    }

    response.json(contact);
  }

  // Create a NEW contact.

  async store(request, response) {
    const { name, email, phone, category_id } = request.body;

    if(!name) {
      return response.status(400).json({ err: 'Name is required' });
    }

    if(!email) {
      return response.status(400).json({ err: 'Email is required' });
    }

    const contactAlreadyExists = await ContactRepository.findByEmail(email);

    if (contactAlreadyExists) {
      return response.status(400).json({ err: 'Email is already registered' });
    }

    const contact = await ContactRepository.createNewContact({
      name, email, phone, category_id,
    });

    response.json(contact);

  }

  // Update an UNIQUE contact.

  async update(request, response) {
    const { id } = request.params;
    const { name, email, phone, category_id } = request.body;

    const contactAlreadyExists = await ContactRepository.findById(id);
    if (!contactAlreadyExists) {
      return response.status(404).json({ error: 'User not found'} );
    }
    if(!name) {
      return response.status(400).json({ err: 'Name is required' });
    }

    const contactEmail = await ContactRepository.findByEmail(email);
    if (contactEmail && contactEmail.id !== id) {
      return response.status(400).json({ err: 'Email is already registered' });
    }

    const contact = await ContactRepository.updateContact(id,{
      name, email, phone, category_id
    });

    response.json(contact);
  }

  // Delete an UNIQUE contact.

  async delete(request, response) {
    const { id } = request.params;
    const contact = await ContactRepository.findById(id);

    await ContactRepository.deleteContact(id);
    // 204: No Content
    response.sendStatus(204);
  }
}

module.exports = new ContactController();

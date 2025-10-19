import { getDataSource } from '../../config/database.js';
import AuthorSchema from './entities/author.entity.js';
import LibrarianSchema from './entities/librarian.entity.js';
import MemberSchema from './entities/member.entity.js';
import { Roles } from './entities/role.enum.js';
import { Messages } from '../../shared/messages.js';

const AUTHOR = 'Autor';
const LIBRARIAN = 'Bibliotecario';
const MEMBER = 'Socio';

async function getRepo(role) {
    const ds = await getDataSource();
    let repo;
    if (role === Roles[1]) repo = ds.getRepository(AuthorSchema);
    else if (role === Roles[2]) repo = ds.getRepository(LibrarianSchema);
    else if (role === Roles[3]) repo = ds.getRepository(MemberSchema); 
    else repo = ds.getRepository(MemberSchema);

    return repo;
};

export async function createUser(role, payload) {
    const { name, lastname } = payload
    const repo = await getRepo(role);

    const user = repo.create({ 
        name: name.trim(), 
        lastname: lastname.trim(),
    });

    await repo.save(user);

    return { id: user.id, message: Messages.SUCCESS.CREATED(AUTHOR) };
};

export async function findUserById(role, id) {
    const repo = await getRepo(role);
    return await repo.findOne({
        where: { id, is_deleted: false },
        select: {
            id: true,
            role: true,
            refresh_token_hash: true,
        },
    });
};


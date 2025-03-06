export const migrarBaseDatos = async (db) => {
    const VersionBaseDatos = 1;
    let { user_version: versionActual } = await db.getFirstAsync('PRAGMA user_version');
    
    if (versionActual >= VersionBaseDatos) {
        return;
    }

    if (versionActual == 0) {
        await db.execAsync('PRAGMA journal_mode = "wal"; CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY NOT NULL, nombre TEXT, correo TEXT);');
        versionActual = 1;
    }

    await db.execAsync(`PRAGMA user_version = ${VersionBaseDatos}`);
}

// Función para agregar un nuevo usuario a la base de datos
export const agregarUsuario = async (db, nombre, correo) => {
    try {
        if (nombre.trim() !== '' && correo.trim() !== '') {
            const result = await db.runAsync(
                'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)',
                [nombre, correo]
            );
            return result.lastInsertRowId; // Retorna el ID del nuevo usuario insertado
        }
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        throw error;
    }
};

// Función para actualizar un usuario existente
export const actualizarUsuario = async (db, id, nombre, correo) => {
    try {
        await db.runAsync(
            'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
            [nombre, correo, id]
        );
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
};

// Función para eliminar un usuario
export const eliminarUsuario = async (db, id) => {
    try {
        const resultados = await db.getAllAsync('SELECT COUNT(*) as count FROM usuarios WHERE id = ?', [id]);
        const resultado = resultados[0]; // Obtener el primer resultado
        
        if (resultado.count > 0) {
            await db.runAsync('DELETE FROM usuarios WHERE id = ?', [id]);
        } else {
            console.log('El usuario con ese ID no existe');
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        throw error;
    }
};

// Función para obtener todos los usuarios
export const obtenerUsuarios = async (db) => {
    try {
        return await db.getAllAsync('SELECT * FROM usuarios');
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};
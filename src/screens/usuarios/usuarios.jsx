import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, ScrollView, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { styles } from './Usuarios.styles';
import { agregarUsuario, eliminarUsuario, actualizarUsuario, obtenerUsuarios } from '../servicios/Database';
import { useSQLiteContext } from 'expo-sqlite';

const image = require('../../../assets/fondo.png'); 

export const Usuarios = () => {
  const db = useSQLiteContext();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const recargarUsuarios = async () => {
    try {
      await db.withExclusiveTransactionAsync(async () => {
        const listaUsuarios = await obtenerUsuarios(db);
        setUsuarios(listaUsuarios);
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    const inicializarDB = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            correo TEXT
          )
        `);
        recargarUsuarios();
      } catch (error) {
        console.error("Error al inicializar la base de datos:", error);
      }
    };
    
    inicializarDB();
  }, []);

  const handleAgregarUsuario = async () => {
    if (nombre.trim() && correo.trim()) {
      try {
        await agregarUsuario(db, nombre, correo);
        setNombre('');
        setCorreo('');
        await recargarUsuarios();
      } catch (error) {
        console.error("Error al agregar usuario:", error);
      }
    } else {
      Alert.alert("Error", "Nombre y correo son obligatorios");
    }
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setModalVisible(true);
  };

  const handleGuardarCambios = async () => {
    if (nombre.trim() && correo.trim()) {
      try {
        await actualizarUsuario(db, usuarioEditando.id, nombre, correo);
        setModalVisible(false);
        setNombre('');
        setCorreo('');
        setUsuarioEditando(null);
        await recargarUsuarios();
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
    } else {
      Alert.alert("Error", "Nombre y correo son obligatorios");
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      Alert.alert(
        "Confirmar eliminación",
        "¿Estás seguro de que deseas eliminar este usuario?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Eliminar", 
            onPress: async () => {
              await eliminarUsuario(db, id);
              await recargarUsuarios();
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <View style={styles.overlay}>
            <Text style={styles.title}>Gestión de Usuarios</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Agregar Usuario</Text>
              <TextInput
                style={styles.entrada}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.entrada}
                value={correo}
                onChangeText={setCorreo}
                placeholder="Correo electrónico"
                placeholderTextColor="#888"
                keyboardType="email-address"
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAgregarUsuario}
              >
                <Text style={styles.addButtonText}>Agregar Usuario</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.areaLista} contentContainerStyle={styles.scrollContent}>
              <Text style={styles.tituloSeccion}>Lista de Usuarios</Text>
              {usuarios.length === 0 ? (
                <Text style={styles.emptyListText}>No hay usuarios registrados</Text>
              ) : (
                usuarios.map((usuario) => (
                  <View key={usuario.id} style={styles.itemContainer}>
                    <View style={styles.infoContainer}>
                      <Text style={styles.nombreText}>{usuario.nombre}</Text>
                      <Text style={styles.correoText}>{usuario.correo}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditarUsuario(usuario)}
                      >
                        <Text style={styles.editButtonText}>✎</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleEliminarUsuario(usuario.id)}
                      >
                        <Text style={styles.deleteButtonText}>✗</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            
            {/* Modal para editar usuario */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Editar Usuario</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Nombre"
                  />
                  <TextInput
                    style={styles.modalInput}
                    value={correo}
                    onChangeText={setCorreo}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.buttonCancel]}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                        setNombre('');
                        setCorreo('');
                        setUsuarioEditando(null);
                      }}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.buttonSave]}
                      onPress={handleGuardarCambios}
                    >
                      <Text style={styles.modalButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ImageBackground>
      </View>
    </NativeBaseProvider>
  );
};
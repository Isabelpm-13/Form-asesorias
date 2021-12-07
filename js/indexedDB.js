const indexedDB = window.indexedDB
const form = document.getElementById('form')


if(indexedDB){
  let db
  const request = indexedDB.open('AsesoriasList', 1)
  
  request.onsuccess = () =>{
    db = request.result
    console.log('OPEN', db)
}

  request.onupgradeneeded = () => {
    db = request.result
    console.log('Create', db)
    const objectStore = db.createObjectStore('asesorias', {
      autoIncrement: true
    })

  }

  request.onerror = (error) => {
    console.log('Ha sucedido un error', error)
  }

  const addData = (data) => {
    const transaction = db.transaction(['asesorias'], 'readwrite')
    const objectStore = transaction.objectStore('asesorias')
    const request = objectStore.add(data)
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = {
      asesoriaNombre: e.target.nombre.value,
      asesoriaMatricula: e.target.matricula.value,
      asesoriaCarrera: e.target.carrera.value,
      asesoriaCuatrimestre: e.target.cuatrimestregrupo.value,
      asesoriaFecha: e.target.fecha.value,
      asesoriaHora: e.target.horai.value,
      asesoriaHora: e.target.horat.value,
      asesoriaMateria: e.target.materia.value,
      asesoriaDocente: e.target.profesor.value,
      asesoriaTema: e.target.tema.value
    }
    console.log(data)
        addData(data)
  })
}
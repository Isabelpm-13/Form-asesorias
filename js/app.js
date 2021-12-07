let newServiceWorker;
              

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then((registerEvent) => {
        registerEvent.addEventListener("updatefound", () => {
          newServiceWorker = registerEvent.installing;
  
          newServiceWorker.addEventListener("statechange", () => {
            //if(newServiceWorker.state == 'installed' ){}
  
               
            switch (newServiceWorker.state) {
              case "installed":
                showSnackbarUpdate();
  
                break;
            }
          });
        });
      });
    });
  
   function alertConection(error){
    noContent.innerHTML =  `
    <div class="col text-center">
    <h1 class="title">No hay conexion a internet </h1>
    <div class="conexion">
    <img src="/assets/noconnection.png" class ="img-fluid" alt=Responsive image"></div>
    </div>
    `;
  }
  }
 

 //snackbar
  function showSnackbarUpdate() {
    let x = document.getElementById("snackbar");
    x.className = "show";
  }

  let launchUpdate = document.getElementById('launchUpdate');
launchUpdate.addEventListener('click', () => {
    newServiceWorker.postMessage({
        action: 'skipWaiting'
    })

    window.location.reload()
})


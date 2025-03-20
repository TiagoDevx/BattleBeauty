// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDFk9w6znXDAAkKlmMTZBp-8MrKqVU8LcI",
  authDomain: "beauty-battle-fd3f7.firebaseapp.com",
  projectId: "beauty-battle-fd3f7",
  storageBucket: "beauty-battle-fd3f7.appspot.com",
  messagingSenderId: "47606041874",
  appId: "1:47606041874:web:f96ea955b2c9aa793ef7cb",
  measurementId: "G-61VRFEK3HS"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

// Função pra ir pra página de cadastro
function goToSignUp() {
  window.location.href = "signup.html";
}

// Função pra ir pra página de perfil
function goToProfile() {
  window.location.href = "profile.html";
}

// Função pra voltar pra home
function goToHome() {
  window.location.href = "home.html";
}

// Função para login
function signIn() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const authMessage = document.getElementById("auth-message");

  if (!email || !password) {
    authMessage.innerText = "Preencha email e senha!";
    authMessage.className = "message error";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      authMessage.innerText = "Login realizado com sucesso!";
      authMessage.className = "message success";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    })
    .catch((error) => {
      let errorMessage;
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Usuário não encontrado!";
          break;
        case "auth/wrong-password":
          errorMessage = "Senha incorreta!";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido!";
          break;
        default:
          errorMessage = "Erro ao fazer login. Tente novamente!";
      }
      authMessage.innerText = errorMessage;
      authMessage.className = "message error";
    });
}

// Função para cadastrar usuário
function signUp() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const age = document.getElementById("age")?.value;
  const gender = document.getElementById("gender")?.value;
  const password = document.getElementById("password")?.value;
  const photo = document.getElementById("photo")?.files[0];
  const authMessage = document.getElementById("auth-message");

  if (!name || !email || !age || !gender || !password) {
    authMessage.innerText = "Preencha todos os campos obrigatórios!";
    authMessage.className = "message error";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Se tiver foto, faz upload
      if (photo) {
        const storageRef = storage.ref(`photos/${user.uid}`);
        return storageRef.put(photo).then(() => user);
      }
      return user;
    })
    .then((user) => {
      // Atualiza o perfil com o nome
      return user.updateProfile({ displayName: name });
    })
    .then(() => {
      authMessage.innerText = "Cadastro realizado com sucesso!";
      authMessage.className = "message success";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    })
    .catch((error) => {
      let errorMessage;
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Este email já está cadastrado!";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido!";
          break;
        case "auth/weak-password":
          errorMessage = "A senha deve ter pelo menos 6 caracteres!";
          break;
        default:
          errorMessage = "Erro ao cadastrar. Tente novamente!";
      }
      authMessage.innerText = errorMessage;
      authMessage.className = "message error";
    });
}

// Função para logout
function signOut() {
  auth.signOut()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("Erro ao sair: " + error.message);
    });
}

// Carrega os dados do perfil e gerencia redirecionamentos
auth.onAuthStateChanged((user) => {
  if (user) {
    // Se estiver em index ou signup, redireciona pra home
    if (window.location.pathname.includes("index.html") || window.location.pathname.includes("signup.html")) {
      window.location.href = "home.html";
    }
    // Se estiver na página de perfil, carrega os dados
    if (window.location.pathname.includes("profile.html")) {
      document.getElementById("profile-name").innerText = user.displayName || "Não definido";
      document.getElementById("profile-email").innerText = user.email;
      document.getElementById("profile-age").innerText = "Não disponível"; // Ainda não salvo
      document.getElementById("profile-gender").innerText = "Não disponível"; // Ainda não salvo

      // Carrega a foto, se existir
      const photoRef = storage.ref(`photos/${user.uid}`);
      photoRef.getDownloadURL()
        .then((url) => {
          const img = document.getElementById("profile-photo");
          img.src = url;
          img.style.display = "block";
        })
        .catch((error) => {
          console.log("Nenhuma foto encontrada ou erro:", error);
        });
    }
  } else {
    // Se não estiver logado e não estiver em index ou signup, redireciona pra login
    if (!window.location.pathname.includes("index.html") && !window.location.pathname.includes("signup.html")) {
      window.location.href = "index.html";
    }
  }
});
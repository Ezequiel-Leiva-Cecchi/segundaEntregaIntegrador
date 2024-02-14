const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async (e) => {
    try {
        const result = await fetch('http://localhost:8080/api/session/logout', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (result.ok) {
            // Si la respuesta es exitosa, muestra un mensaje y redirige al usuario al inicio de sesión
            alert('¡You have logged out successfully.!');
            window.location.href = 'http://localhost:8080/login';
        } else {
            // Si hay un problema con la respuesta, muestra un mensaje de error
            alert('There was a problem slogged out. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('There was a problem slogged out. Please try again.');
    }
});
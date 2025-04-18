document.getElementById("cantidad").addEventListener("input", () => {
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const container = document.getElementById("edades-container");
    container.innerHTML = "";

    if (!isNaN(cantidad) && cantidad > 0 && cantidad <= 10) {
        for (let i = 1; i <= cantidad; i++) {
            const div = document.createElement("div");
            div.innerHTML = `
        <label class="block font-semibold">Edad del visitante ${i}:</label>
        <input type="number" min="0" required class="w-full border rounded px-3 py-2" name="edad-${i}" />
      `;
            container.appendChild(div);
        }
    }
});

document.getElementById("form-compra").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fecha = document.getElementById("fecha").value;
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const pase = document.getElementById("pase").value;
    const formaPago = document.getElementById("formaPago").value;

    const edadesInputs = document.querySelectorAll('[name^="edad-"]');
    const edades = Array.from(edadesInputs).map(input => parseInt(input.value));

    try {
        const res = await fetch("/api/comprar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha, cantidad, edades, pase, formaPago })
        });

        const data = await res.json();

        if (data.redireccion) {
            window.location.href = data.url;
        } else {
            document.getElementById("resultado").textContent = data.mensaje;
        }
    } catch (err) {
        document.getElementById("resultado").textContent = "Error en la compra.";
    }
});


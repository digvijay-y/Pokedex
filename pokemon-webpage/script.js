function getRandomPokemonId() {
    return Math.floor(Math.random() * 898) + 1; // There are 898 Pokémon in the API
}

async function fetchPokemon() {
    const pokemonId = getRandomPokemonId();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    displayPokemon(data);
}

function displayPokemon(pokemon) {
    const pokemonInfo = document.getElementById('pokemon-info');
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    const height = pokemon.height;
    const moves = pokemon.moves.slice(0, 5).map(move => move.move.name).join(', ');

    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p><strong>Height:</strong> ${height}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <p><strong>Moves:</strong> ${moves}</p>
    `;
}

document.getElementById('load-pokemon').addEventListener('click', async () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block'; // Show spinner

    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();

    spinner.style.display = 'none'; // Hide spinner
    const fallbackImage = 'https://via.placeholder.com/150?text=No+Image';

    document.getElementById('pokemon-image').src = data.sprites.front_default || fallbackImage;

    // Update Pokémon info
    document.getElementById('pokemon-name').textContent = data.name;
    document.getElementById('pokemon-ability').textContent = data.abilities[0]?.ability.name || 'N/A';
    document.getElementById('pokemon-height').textContent = data.height;
    document.getElementById('pokemon-moves').textContent = data.moves.slice(0, 5).map(move => move.move.name).join(', ');
    document.getElementById('pokemon-image').src = data.sprites.front_default || '';
    document.getElementById('pokemon-image').alt = data.name || 'Pokemon Image';

    // Add Pokémon type
    const types = data.types.map(type => type.type.name).join(', ');
    document.getElementById('pokemon-type').textContent = types;

    // Fetch and add evolution info
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    if (speciesData.evolution_chain) {
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        let nextEvolution = 'N/A';
        let currentStage = evolutionData.chain;

        while (currentStage) {
            if (currentStage.species.name === data.name && currentStage.evolves_to.length > 0) {
                nextEvolution = currentStage.evolves_to[0].species.name;
                break;
            }
            currentStage = currentStage.evolves_to[0];
        }

        document.getElementById('pokemon-evolution').textContent = nextEvolution;
    } else {
        document.getElementById('pokemon-evolution').textContent = 'N/A';
    }
});
let currentPokemonIndex = null;
let pokemonData = null;

const GET_POKEMON_QUERY = `
  query getPokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      types {
        type {
          name
        }
      }
      stats {
        stat {
          name
        }
        base_stat
      }
      height
      weight
      sprites {
        front_default
        front_shiny
      }
      abilities {
        ability {
          name
        }
      }
    }
  }
`;

const GET_ABILITY_QUERY = `
  query getAbility($name: String!) {
    ability(name: $name) {
      name
      effect_entries {
        effect
        language {
          name
        }
      }
      pokemon {
        pokemon {
          name
        }
      }
    }
  }
`;

async function searchPokemon() {
    const input = document.getElementById("pokemonInput").value.toLowerCase();
    let pokemon;

    if (isNaN(input)) {
        pokemon = await fetchPokemonByName(input);
    } else {
        pokemon = await fetchPokemonByNumber(input);
    }

    if (pokemon) {
        pokemonData = pokemon;
        displayPokemonInfo(pokemon);
        fetchPokemonCry(pokemon.id); 
    } else {
        alert("Pokémonia ei löytynyt.");
    }
}

async function fetchPokemonByName(name) {
    const queryVariables = { name: name };

    const response = await fetch('https://graphql-pokeapi.graphcdn.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: GET_POKEMON_QUERY,
            variables: queryVariables
        })
    });

    const data = await response.json();
    return data.data.pokemon; 
}


async function fetchPokemonByNumber(number) {
    const queryVariables = { name: number.toString() };

    const response = await fetch('https://graphql-pokeapi.graphcdn.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: GET_POKEMON_QUERY,
            variables: queryVariables
        })
    });

    const data = await response.json();
    return data.data.pokemon; 
}
function displayPokemonInfo(pokemon) {
    currentPokemonIndex = pokemon.id;

    const pokemonInfo = document.getElementById("pokemonInfo");
    pokemonInfo.innerHTML = `
        <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
        <p>Pokedex numero: ${pokemon.id}</p>
        <p>Tyypit: ${pokemon.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join(", ")}</p>
        <p>Paino: ${pokemon.weight / 10} kg</p>
        <p>Korkeus: ${pokemon.height / 10} m</p>
        <div class="stats">
            <span>HP: ${pokemon.stats[0].base_stat}</span>
            <span>Attack: ${pokemon.stats[1].base_stat}</span>
            <span>Defense: ${pokemon.stats[2].base_stat}</span>
            <span>Speed: ${pokemon.stats[5].base_stat}</span>
        </div>
        <div class="image-container">
            <img src="${pokemon.sprites.front_default}" alt="Normal sprite" class="pokemon-image">
            <img src="${pokemon.sprites.front_shiny}" alt="Shiny sprite" class="pokemon-image">
        </div>
    `;

    const abilityInfo = document.getElementById("abilityInfo");
    abilityInfo.innerHTML = `<h3>Abilityt:</h3><ul class="ability-list">${pokemon.abilities.map(ability => `<li onclick="fetchAbilityInfo('${ability.ability.name}')">${ability.ability.name}</li>`).join('')}</ul>`;
}

async function fetchAbilityInfo(abilityName) {
    const queryVariables = { name: abilityName };

    const response = await fetch('https://graphql-pokeapi.graphcdn.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: GET_ABILITY_QUERY,
            variables: queryVariables
        })
    });

    const data = await response.json();
    const ability = data.data.ability;

    const abilityInfo = document.getElementById("abilityInfo");
    abilityInfo.innerHTML = `
        <h3>Ability: ${ability.name}</h3>
        <p>Efekti: ${ability.effect_entries[0].effect}</p>
        <p>Pokémonit, joilla on tämä ability: </p>
        <ul>${ability.pokemon.map(poke => `<li>${poke.pokemon.name}</li>`).join('')}</ul>
    `;
}

function getNextPokemon() {
    if (pokemonData) {
        currentPokemonIndex++;
        fetchPokemonByNumber(currentPokemonIndex).then(pokemon => {
            pokemonData = pokemon;
            displayPokemonInfo(pokemon);
            fetchPokemonCry(pokemon.id); 
        });
    }
}

function getPreviousPokemon() {
    if (pokemonData) {
        currentPokemonIndex--;
        fetchPokemonByNumber(currentPokemonIndex).then(pokemon => {
            pokemonData = pokemon;
            displayPokemonInfo(pokemon);
            fetchPokemonCry(pokemon.id); 
        });
    }
}

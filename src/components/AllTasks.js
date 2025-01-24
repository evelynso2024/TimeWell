// ... (keep all imports and initial state the same, but update sortBy default)
  const [sortBy, setSortBy] = useState('date-newest'); // Updated default sort

  // ... (keep all other code the same until the sort switch statement)

  // Update the sort logic in the useEffect:
    // Sort tasks
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-newest':
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'date-oldest':
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'duration-longest':
        filtered.sort((a, b) => durationToSeconds(b.duration) - durationToSeconds(a.duration));
        break;
      case 'duration-shortest':
        filtered.sort((a, b) => durationToSeconds(a.duration) - durationToSeconds(b.duration));
        break;
      default:
        break;
    }

  // ... (keep all other code the same until the sort dropdown)

  // Update the sort dropdown in the UI:

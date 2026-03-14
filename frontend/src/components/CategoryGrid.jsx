import { API_BASE_URL } from '../config';

const CategoryGrid = () => {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/collections`)
            .then(res => setCollections(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <section className="category-section">
            <div className="container">
                <div className="section-header">
                    <h2>Our Collections</h2>
                    <p>Explore our themed t-shirt collections</p>
                </div>
                <div className="collection-grid">
                    {collections.map(col => (
                        <Link
                            to={`/collection/${col.id}?name=${col.name}`}
                            key={col.id}
                            className="collection-card"
                        >
                            <img
                                src={col.image_url || `https://picsum.photos/seed/${col.name}/400/400`}
                                alt={col.name}
                            />
                            <div className="collection-overlay">
                                <h3>{col.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;

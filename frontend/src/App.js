import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import "./App.css";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:8080/query",
  cache: new InMemoryCache(),
});

// GraphQL Queries and Mutations
const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($account: AccountInput!) {
    createAccount(account: $account) {
      id
      name
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($product: ProductInput!) {
    createProduct(product: $product) {
      id
      name
      description
      price
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($order: OrderInput!) {
    createOrder(order: $order) {
      id
      totalPrice
      products {
        name
        quantity
      }
    }
  }
`;

// Account Component
function Accounts() {
  const { loading, error, data, refetch } = useQuery(GET_ACCOUNTS);
  const [name, setName] = useState("");
  const [createAccount] = useMutation(CREATE_ACCOUNT, {
    onCompleted: () => {
      refetch();
      setName("");
    },
  });

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p>Error loading accounts: {error.message}</p>;

  return (
    <div className="section">
      <h2>Accounts</h2>
      <div className="form">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Account Name"
        />
        <button
          onClick={() => {
            if (name) {
              createAccount({ variables: { account: { name } } });
            }
          }}
        >
          Create Account
        </button>
      </div>
      <div className="list">
        {data?.accounts?.length > 0 ? (
          data.accounts.map((account) => (
            <div key={account.id} className="item">
              <p>
                <strong>ID:</strong> {account.id}
              </p>
              <p>
                <strong>Name:</strong> {account.name}
              </p>
            </div>
          ))
        ) : (
          <p>No accounts found</p>
        )}
      </div>
    </div>
  );
}

// Products Component
function Products() {
  const { loading, error, data, refetch } = useQuery(GET_PRODUCTS);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      setProduct({ name: "", description: "", price: "" });
    },
  });

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div className="section">
      <h2>Products</h2>
      <div className="form">
        <input
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          placeholder="Product Name"
        />
        <input
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          placeholder="Description"
        />
        <input
          value={product.price}
          type="number"
          onChange={(e) =>
            setProduct({ ...product, price: parseFloat(e.target.value) })
          }
          placeholder="Price"
        />
        <button
          onClick={() => {
            if (product.name && product.description && product.price) {
              createProduct({
                variables: {
                  product: {
                    name: product.name,
                    description: product.description,
                    price: parseFloat(product.price),
                  },
                },
              });
            }
          }}
        >
          Create Product
        </button>
      </div>
      <div className="list">
        {data?.products?.length > 0 ? (
          data.products.map((product) => (
            <div key={product.id} className="item">
              <p>
                <strong>ID:</strong> {product.id}
              </p>
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>Microservices Frontend</h1>
          <p>Test your GraphQL API and microservices</p>
        </header>
        <main>
          <Accounts />
          <Products />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;

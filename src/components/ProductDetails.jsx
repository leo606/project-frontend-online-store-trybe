import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Quantities from './Quantities';

export default class ProductDetails extends Component {
  constructor(props) {
    super(props);
    const { match: { params: { id } } } = this.props;
    this.state = {
      id,
      title: '',
      thumbnail: '',
      qty: 1,
      price: '',
      pictures: {},
    };
    this.getProductFromId = this.getProductFromId.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { id } = this.state;
    this.getProductFromId(id);
  }

  handleClick() {
    const { callback } = this.props;
    const { id, title, price, thumbnail, qty } = this.state;
    callback({ id, title, price, thumbnail, qty });
  }

  async getProductFromId(id) {
    const apiURL = `https://api.mercadolibre.com/items/${id}`;
    let resultRequest = await fetch(apiURL);
    resultRequest = await resultRequest.json();
    this.setState({
      title: resultRequest.title,
      thumbnail: resultRequest.thumbnail,
      price: resultRequest.price,
      pictures: resultRequest.pictures[0],
      freeShipping: resultRequest.shipping.free_shipping,
    });
  }

  render() {
    const { title, price, pictures, freeShipping } = this.state;
    const { quantity } = this.props;
    return (
      <div>
        <img src={ pictures.url } alt="Imagem do Produto" />
        <h1 data-testid="product-detail-name">
          {title}
        </h1>
        {!freeShipping ? (
          <span data-testid="shipping">
            Confira os preços de frete para sua residência.
          </span>
        ) : (
          <span data-testid="free-shipping">
            Frete Gratuito para sua residência.
          </span>
        )}
        <p>{price}</p>
        <input
          name="rating"
          type="range"
          min="1"
          max="5"
        />

        <textarea data-testid="product-detail-evaluation" />
        <button type="button">Submit</button>
        <button type="button">
          <Link to="/cart" data-testid="shopping-cart-button">Carrinho</Link>
          <Quantities quantity={ quantity } />
        </button>
        <Link to="/">Voltar</Link>
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ this.handleClick }
        >
          Adicionar ao carrinho
        </button>
      </div>
    );
  }
}

ProductDetails.defaultProps = {
  id: undefined,
  quantity: undefined,
};

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired }).isRequired,
  id: PropTypes.string,
  callback: PropTypes.func.isRequired,
  quantity: PropTypes.number,
};

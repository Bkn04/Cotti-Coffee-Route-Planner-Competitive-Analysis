import { useState } from 'react';

function AddressInput({ placeholder, buttonText, onSubmit, isLoading, disabled = false }) {
  const [address, setAddress] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address.trim()) {
      return;
    }

    setLocalLoading(true);

    try {
      await onSubmit(address.trim());
      setAddress(''); // Clear input on success
    } catch (error) {
      console.error('Error submitting address:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-group">
      <input
        type="text"
        className="form-input"
        placeholder={placeholder}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        disabled={disabled || isLoading || localLoading}
      />
      <button
        type="submit"
        className="btn btn-primary btn-block mt-1"
        disabled={!address.trim() || disabled || isLoading || localLoading}
      >
        {localLoading || isLoading ? (
          <>
            <span className="loading-spinner"></span>
            <span>处理中...</span>
          </>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}

export default AddressInput;

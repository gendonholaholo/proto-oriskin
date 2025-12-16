FROM python:3.12-slim-bookworm

WORKDIR /app

# Install uv via pip (alternative to ghcr.io)
RUN pip install uv

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Copy dependency files first (for better caching)
COPY pyproject.toml uv.lock* ./

# Sync dependencies
RUN uv sync --frozen --no-dev --no-install-project

# Copy application code
COPY app ./app

# Expose port
EXPOSE 8001

# Run application
CMD [".venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]

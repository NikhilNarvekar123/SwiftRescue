import numpy as np
import matplotlib.pyplot as plt

# Load the data from the .npy file
usa_pop_density_data = np.load('usa_pop_density_contiguous.npy')

print(usa_pop_density_data)
print(usa_pop_density_data.shape)

# Define the bounding box for the contiguous USA
usa_minx, usa_maxx = -125, -66
usa_miny, usa_maxy = 24, 50

# Visualize the data using matplotlib
fig, ax = plt.subplots(figsize=(15, 10))
im = ax.imshow(usa_pop_density_data, cmap='YlOrRd', extent=[usa_minx, usa_maxx, usa_miny, usa_maxy])
ax.set_title("Population Density of the Contiguous USA")
ax.set_xlabel("Longitude")
ax.set_ylabel("Latitude")

# Add a colorbar
cbar = fig.colorbar(im, ax=ax, orientation='horizontal', pad=0.01)
cbar.set_label('Population Density')

plt.tight_layout()
plt.show()

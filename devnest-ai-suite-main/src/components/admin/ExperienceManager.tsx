const handleDelete = (experience: Experience) => {
  console.log('Delete button clicked for experience:', experience);
  setExperienceToDelete(experience);
  setDeleteDialogOpen(true);
};

const confirmDelete = () => {
  if (experienceToDelete) {
    console.log('Confirming delete for experience:', experienceToDelete);
    console.log('Experience ID to delete:', experienceToDelete._id);
    
    deleteExperienceMutation.mutate(experienceToDelete._id, {
      onSuccess: (data) => {
        console.log('Delete successful:', data);
        setDeleteDialogOpen(false);
        setExperienceToDelete(null);
      },
      onError: (error) => {
        console.error('Delete failed:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
      }
    });
  }
}; 
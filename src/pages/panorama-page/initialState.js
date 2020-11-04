/**
 * Accessing userPage, a Project is Loaded -> Set the State to the initial marked scene object ->
 * When user clicks on hotspot set the state to a scene ID to which is linked
 *
 *
 */

const initialState = {
  projects: {
    "ProjectID": {
      name: "Initial_project",
      scene: [
        {
          id: "Scene ID",
          title: "Scene title",
          image360: "Link to the image",
          hotspots: [
            { x: -300, y: 0, z: 490, linkTo: "imageLink", title: "Title" },
          ],
        },
      ],
    },
  },
};

/**
 * Methods:
 * addProject(ID, name)
 * addSceneToProject(projectID, sceneID, title, image, thumbnail, hotspots)
 * addHotspotToScene(sceneId,hotspotID, x, y, z, imageLink, Title)
 * removeHotspot(hotSpotID,)
 */

export default initialState;
